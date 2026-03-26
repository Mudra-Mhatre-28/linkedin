import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const createUsers = async () => {

  try {

    await mongoose.connect(process.env.MONGO_URI);

    const users = [];

    for (let i = 0; i < 100; i++) {

      const password = await bcrypt.hash("password123", 10);

      users.push({
        name: faker.person.fullName(),
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: password,
        profilePicture: faker.image.avatar(),
        headline: faker.person.jobTitle(),
        location: faker.location.city(),
        about: faker.lorem.sentence(),
      });

    }

    await User.insertMany(users);

    console.log("✅ 100 random users created");

    process.exit();

  } catch (error) {

    console.log(error);
    process.exit(1);

  }

};

createUsers();