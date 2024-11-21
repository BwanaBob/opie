// many problems with session handling. loadsession isn't being used. there is no session in the class. need to streamline


const { AtpAgent } = require("@atproto/api");
const fs = require("fs");
const jwt = require("jsonwebtoken");

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

  // Check if session is valid
  isSessionValid(session) {
    console.log(!session)
    console.log(!session.data)
    console.log(!session.data.accessJwt)
    if (!session || !session.data || !session.data.accessJwt) {
      console.warn("Session is invalid: Missing accessJwt.");
      return false;
    }
  
    try {
      const decoded = jwt.decode(session.data.accessJwt, { complete: true });
  
      if (!decoded) {
        console.warn("Session is invalid: Decoded JWT is null.");
        return false;
      }
  
      console.log("Decoded JWT:", JSON.stringify(decoded, null, 2));
  
      // Ensure the `exp` field exists
      if (!decoded.payload || !decoded.payload.exp) {
        console.warn("Session is invalid: JWT does not contain expiration info.");
        return false;
      }
  
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      console.log(`Current time: ${now}, Token expires at: ${decoded.payload.exp}`);
  
      if (decoded.payload.exp <= now) {
        console.warn("Session is invalid: Access token has expired.");
        return false;
      }
  
      console.log("Session is valid.");
      return true;
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return false;
    }
  }
  
  // Resume or login to create a session
  async ensureAuthenticated() {
    console.log("Session exists: ", !!this.session)
    if (this.session && this.isSessionValid(this.session)) {
      try {
        console.log("Session is valid. Resuming valid session...");
        await this.agent.resumeSession(this.session.data); // Resume with existing session
        return;
      } catch (err) {
        console.warn("Failed to resume session:", err.message);
        // Fall through to re-login if resuming fails
      }
    }
  
    console.warn("Session expired or not found. Logging in...");
    await this.login(); // Perform login and update session
  }


  async login() {
    try {
      if (this.session?.data?.refreshJwt) {
        console.log("Attempting to refresh session...");
        const refreshedSession = await this.agent.refreshSession(this.session.data.refreshJwt);
        this.session = refreshedSession; // Save the refreshed session
        console.log("Session refreshed successfully.");
        return;
      }
    } catch (err) {
      console.warn("Failed to refresh session:", err.message);
    }
  
    console.log("Logging in with credentials...");
    const session = await this.agent.login({
      identifier: this.username,
      password: this.password,
    });
    this.persistSession("create", session);
    console.log("Logged in successfully.");
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
