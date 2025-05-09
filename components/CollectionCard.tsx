"use client";
import { deleteCollection } from "@/actions/collection";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { Collection, Task } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { CaretDownIcon, CaretUpIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import CreateTaskDialog from "./CreateTaskDialog";
import PlusIcon from "./PlusIcon";
import TaskCard from "./TaskCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";

type Props = { collection: Collection & { tasks: Task[] } };

const CollectionCard = ({ collection }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isloading, startTransition] = useTransition();

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      toast("Collection deleted successfully");
    } catch (error) {
      toast.error("Cannot delete collection ");
      console.error(error);
    }
  };

  const tasksDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);

  if (!collection) {
    return null;
  }

  const totalTasks = collection.tasks.length;
  const progress = totalTasks === 0 ? 0 : (tasksDone / totalTasks) * 100;

  return (
    <>
      <CreateTaskDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "flex w-full justify-between p-6",
              isOpen && "rounded-b-none",
              CollectionColors[collection.color as CollectionColor],
            )}
          >
            <span className="font-bold text-white">{collection.name}</span>
            {!isOpen && <CaretDownIcon className="h-6 w-6 text-white" />}
            {isOpen && <CaretUpIcon className="h-6 w-6 text-white" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col rounded-b-md shadow-lg dark:bg-neutral-900">
          {collection?.tasks.length === 0 && (
            <Button
              variant={"ghost"}
              className="flex items-center justify-center gap-1 rounded-none p-8 py-12"
              onClick={() => setShowCreateModal(true)}
            >
              <p>There are no tasks yet:</p>
              <span
                className={cn(
                  "bg-clip-text text-sm text-transparent",
                  CollectionColors[collection.color as CollectionColor],
                )}
              >
                Create one
              </span>
            </Button>
          )}
          {collection?.tasks.length > 0 && (
            <>
              <Progress className="rounded-none" value={progress} />
              <div className="flex flex-col gap-3 p-4">
                {collection?.tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}
          <Separator />
          <footer className="flex h-[40px] items-center justify-between p-[2px] px-4 text-xs text-neutral-500">
            <p>Created at {collection.createdAt.toLocaleDateString("nl-be")}</p>
            {isloading && <div>Deleting...</div>}
            {!isloading && (
              <div>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  onClick={() => setShowCreateModal(true)}
                >
                  <PlusIcon />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={"icon"} variant={"ghost"}>
                      <TrashIcon />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action can not be undone. This will permanently
                      delete your collection and all tasks inside it.
                    </AlertDialogDescription>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        startTransition(removeCollection);
                        removeCollection();
                      }}
                    >
                      Proceed
                    </AlertDialogAction>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default CollectionCard;
