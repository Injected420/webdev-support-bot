import { Message } from 'discord.js';
import { HELPFUL_ROLE_ID } from '../env';
import { Document } from 'mongoose';
import HelpfulRoleMemberModel from './db_model';

interface IUser extends Document {
  points?: number;
}

export default async (message: Message) => {
  // Check if the message author has the helpful role
  const isHelpfulRoleMember = message.member.roles.cache.find(
    r => r.id === HELPFUL_ROLE_ID
  );
  if (!isHelpfulRoleMember) return;

  // Find or create a database entry
  let user: IUser = await HelpfulRoleMemberModel.findOne({
    user: message.member.id,
  });
  if (!user)
    user = await HelpfulRoleMemberModel.create({
      user: message.member.id,
    });

  // Add a point to the user
  user.points++;

  // Save the user
  user
    .save()
    .then(updated => console.log(`${updated.id} => ${updated.points}`))
    .catch(err => console.error('user.save(): ', err));
};
