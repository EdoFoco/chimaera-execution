import 'reflect-metadata';
import mongoose from "mongoose";
import { config } from './config';
import { GroupRepository } from "../dal/repos/mongodb/GroupRepository";
import { IGroup } from "../models/IGroup";
import Container from "typedi";


// Try Catch wrapper with poller to see changes in groups, update wallets to monitor
const main = async () => {

    await mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' });
   
    console.log("Db connected.");

    const groupRepo = Container.get(GroupRepository);

    const newGroup = <IGroup>{
        name: "hello2",
        wallets: new Map<string, string>()
    };
    newGroup.wallets.set("helloWorld", "helloworld");
    await groupRepo.createGroup(newGroup);
    await groupRepo.getAll();
}

main().catch((err) => {
    console.error(err);
  });
  
