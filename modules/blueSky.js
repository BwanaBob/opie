// TODO:
// add logger to bluesky code

const { AtpAgent } = require("@atproto/api");
const fs = require("fs");

class Bluesky {
  static actorCache = {}; // Shared cache for all instances
  constructor(username, password) {
    this.username = username;
    this.password = password;
    this.sessionFilePath = "./bluesky-session.json";
    this.imagePath = "../resources/banner-no-text.png";
    this.serviceUrl = "https://bsky.social";
    this.agent = new AtpAgent({
      service: this.serviceUrl,
      persistSession: this.persistSession.bind(this),
    });
  }

  // Persist session data to a file
  persistSession(evt, sess) {
    // console.log("Session event:", evt);
    if (evt === "create") {
      fs.writeFileSync(this.sessionFilePath, JSON.stringify(sess));
      // console.log("Session saved.");
    }
  }


// // new functions
// async ensureAuthenticated() {
//   if (!this.sessionData || this.isSessionExpired()) {
//     console.log('Session expired or not available, re-authenticating...');
//     await this.login();
//   }
// }

// async login() {
//   try {
//     // Ensure the login data is provided
//     if (!this.username || !this.password) {
//       throw new Error('Login credentials (username or password) are missing.');
//     }

//     // Attempt to log in using the provided username and password
//     this.sessionData = await this.agent.login({
//       identifier: this.username, // Make sure this is the correct identifier (e.g., email)
//       password: this.password,
//     });

//     console.log('Successfully logged in.');
//   } catch (error) {
//     console.error('Failed to log in:', error);
//     throw error; // Let the caller handle this if necessary
//   }
// }

// isSessionExpired() {
//   if (!this.sessionData || !this.sessionData.expiration) return true;
//   const expirationTime = new Date(this.sessionData.expiration);
//   return Date.now() >= expirationTime.getTime();
// }


  // Resume or create a new session
  async ensureAuthenticated() {
    try {
      if (fs.existsSync(this.sessionFilePath)) {
        const savedSession = JSON.parse(
          fs.readFileSync(this.sessionFilePath, "utf-8")
        );
        await this.agent.resumeSession(savedSession);
        // console.log("Resumed session successfully.");
      } else {
        await this.agent.login({
          identifier: this.username,
          password: this.password,
        });
        // console.log("Logged in successfully.");
      }
    } catch (error) {
      console.error("Failed to ensure authentication:", error);
      throw error;
    }
  }

  async createPostWithImage(text) {
    try {
      await this.ensureAuthenticated(); // Ensure we're authenticated before making the API call
      // Read and upload the image
      const imageBuffer = fs.readFileSync(this.imagePath);
      const uploadedImage = await this.agent.api.com.atproto.repo.uploadBlob(
        imageBuffer,
        {
          encoding: "image/jpeg", // Adjust MIME type as needed
        }
      );

      // Create the post
      await this.agent.api.app.bsky.feed.post.create(
        { repo: this.agent.session.did }, // Use the DID of the authenticated user
        {
          text,
          createdAt: new Date().toISOString(),
          embed: {
            $type: "app.bsky.embed.images",
            images: [
              {
                image: uploadedImage.data.blob,
                alt: "Image description", // Provide a meaningful description
              },
            ],
          },
        }
      );

      console.log("Post created successfully!");
    } catch (err) {
      console.error("Failed to create a post:", err);
    }
  }

  // Resolve a handle to an actorDid, with caching
  async getActorDid(handle) {
    if (Bluesky.actorCache[handle]) {
      // console.log(`Using cached actorDid for handle: ${handle}`);
      return Bluesky.actorCache[handle];
    }
    try {
      const { data } = await this.agent.resolveHandle({ handle });
      Bluesky.actorCache[handle] = data.did; // Store in cache
      // console.log(`Resolved and cached actorDid for handle: ${handle}`);
      return data.did;
    } catch (error) {
      console.error("Failed to resolve handle:", error);
      throw error;
    }
  }

  async getPostsFromUser(handle, filter = "posts_with_media", limit = 10) {
    try {
      await this.ensureAuthenticated(); // Ensure we're authenticated before making the API call

      // Resolve or retrieve actorDid from cache
      const actorDid = await this.getActorDid(handle);

      // console.log("Did found : ", actorDid);
      // Fetch recent posts from the user's feed
      const { data } = await this.agent.getAuthorFeed({
        actor: actorDid,
        filter,
        limit,
      });

      return {
        posts: data.feed,
        nextCursor: data.cursor,
      };
    } catch (error) {
      console.error("Failed to retrieve posts:", error);
      throw error;
    }
  }
}

module.exports = Bluesky;
