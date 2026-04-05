import { Collection } from 'discord.js';
import { Command } from '../types';
import { ping } from './ping';
import { autorole } from './autorole';
import { reactionrole } from './reactionrole';

export const commands = new Collection<string, Command>();

const commandList: Command[] = [ping, autorole, reactionrole];

commandList.forEach((command) => {
  commands.set(command.data.name, command);
});