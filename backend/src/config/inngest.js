import { Inngest } from "inngest";
import connectDB from "./db.js";
import { User } from "../models/user.model.js";
import { addUserToPublicChannels, deleteStreamUser, upsertStreamUser } from "./stream.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "slack-clone" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("➡️ syncUser triggered with event:", JSON.stringify(event.data, null, 2));

    try {
      await connectDB();
      console.log("✅ Database connected inside syncUser");

      const { id, email_addresses, first_name, last_name, image_url, profile_image_url } = event.data;

      const newUser = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || null,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url || profile_image_url || null,
      };

      console.log("📝 Prepared newUser object:", newUser);

      // Insert user into MongoDB
      try {
        const createdUser = await User.create(newUser);
        console.log("✅ User inserted into Mongo:", createdUser._id?.toString());
      } catch (dbErr) {
        console.error("❌ Mongo insert error:", dbErr.message);
        throw dbErr; // stop here if DB insert fails
      }

      // Stream API calls
      try {
        await upsertStreamUser({
          id: newUser.clerkId.toString(),
          name: newUser.name,
          image: newUser.image,
        });
        console.log("✅ upsertStreamUser completed");

        await addUserToPublicChannels(newUser.clerkId.toString());
        console.log("✅ addUserToPublicChannels completed");
      } catch (streamErr) {
        console.error("❌ Stream API error:", streamErr.message);
        throw streamErr;
      }
    } catch (err) {
      console.error("🔥 syncUser failed:", err.stack || err.message || err);
      throw err; // let Inngest mark run as failed with details
    }
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("➡️ deleteUserFromDB triggered with event:", JSON.stringify(event.data, null, 2));

    try {
      await connectDB();
      console.log("✅ Database connected inside deleteUserFromDB");

      const { id } = event.data;

      await User.deleteOne({ clerkId: id });
      console.log("🗑️ User deleted from MongoDB:", id);

      await deleteStreamUser(id.toString());
      console.log("🗑️ User deleted from Stream:", id);
    } catch (err) {
      console.error("🔥 deleteUserFromDB failed:", err.stack || err.message || err);
      throw err;
    }
  }
);

export const functions = [syncUser, deleteUserFromDB];
