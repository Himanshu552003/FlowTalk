
import { Inngest } from "inngest";
import {connectDB} from "./db.js";
import { User } from "../models/user.model.js";
import { addUserToPublicChannels, deleteStreamUser, upsertStreamUser } from "./stream.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "flowtalk" });


const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      console.log("📝 Heck testing object:");
      await connectDB();
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      const newUser = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || null,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url || null,
      };
      console.log("📝 Prepared newUser object:", newUser);
      const createdUser = await User.create(newUser);
      console.log("✅ User inserted into Mongo:", createdUser);
      await upsertStreamUser({
        id: newUser.clerkId.toString(),
        name: newUser.name,
        image: newUser.image,
      });
      await addUserToPublicChannels(newUser.clerkId.toString());
    } catch (err) {
      console.error("❌ syncUser function error:", err);
      throw err;
    }
  }
);


const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      await connectDB();
      const { id } = event.data;
      await User.deleteOne({ clerkId: id });
      await deleteStreamUser(id.toString());
    } catch (err) {
      console.error("❌ deleteUserFromDB function error:", err);
      throw err;
    }
  }
);


export const functions = [syncUser, deleteUserFromDB];