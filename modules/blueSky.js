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
      fs.writeFileSync(this.sessionFilePath, JSON.stringify(sess), "utf8");
      // console.log("Session saved.");
    }
  }

  // Load session from file
  loadSession() {
    if (fs.existsSync(this.sessionFilePath)) {
      return JSON.parse(fs.readFileSync(this.sessionFilePath, "utf8"));
    }
    return null;
  }

  async login() {
    // console.log("Logging in with credentials...");
    await this.agent.login({
      identifier: this.username,
      password: this.password,
    });
    // console.log("Logged in successfully.");
  }

  async createPostWithImage(text) {
    try {
      await this.login()
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
      if (err.response?.status === 401 || err.response?.status === 400) {
        console.warn("Token expired. Re-authenticating...");
        await this.ensureAuthenticated();
        return this.createPostWithImage(text); // Retry after re-authentication
      }
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
      await this.login()

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
      if (error.response?.status === 401 || error.response?.status === 400) {
        console.warn("Token expired. Re-authenticating...");
        await this.ensureAuthenticated();
        return this.getPostsFromUser(handle, filter, limit); // Retry after re-authentication
      }

      console.error("Failed to retrieve posts:", error);
      throw error;
    }
  }
}

module.exports = Bluesky;
