"use server";
import prisma from "@/lib/prisma";
import { wait } from "@/lib/wait";
import { createCollectionSchemType } from "@/schema/createCollection";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createCollection(form: createCollectionSchemType) {
  const user = await currentUser();
  if (!user) {
    throw new Error("user not found");
  }

  revalidatePath("/");

  return await prisma.collection.create({
    data: { userId: user.id, color: form.color, name: form.name },
  });
}

export async function deleteCollection(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new Error("user not found");
  }

  revalidatePath("/");
  return await prisma.collection.delete({ where: { id, userId: user.id } });
}
