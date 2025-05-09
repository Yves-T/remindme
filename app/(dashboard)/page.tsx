import CollectionCard from "@/components/CollectionCard";
import CreateCollectionBtn from "@/components/CreateCollectionBtn";
import SadFace from "@/components/icons/SadFace";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomeMsg />
      </Suspense>
      <Suspense fallback={<div>Loading collections...</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomeMsg() {
  const user = await currentUser();
  if (!user) {
    return <div>error</div>;
  }

  return (
    <div className="mb-12 flex w-full">
      <h1 className="text-4xl font-bold">
        Welcome, <br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className="mb-12 flex w-full">
      <h1 className="text-4xl font-bold">
        <Skeleton className="h-[36px] w-[150px]" />
        <Skeleton className="h-[36px] w-[150px]" />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    where: { userId: user?.id },
    include: { tasks: true },
  });

  if (!collections || collections.length === 0) {
    return (
      <div className="flex flex-col gap-5">
        <Alert>
          <SadFace />
          <AlertTitle>There are no collections yet!</AlertTitle>
          <AlertDescription>
            Create a collection to get started
          </AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionBtn />
      <div className="space-y-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
