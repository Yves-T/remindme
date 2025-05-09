"use client";
import { setTaskToDone } from "@/actions/task";
import { Task } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useTransition } from "react";
import { Checkbox } from "./ui/checkbox";

function getExpirationColor(expiresAt: Date) {
  const days = Math.floor(expiresAt.getTime() - Date.now()) / 1000 / 60 / 60;
  if (days < 0) {
    return "text-gray-500 dark:text-gray-300";
  }
  if (days <= 3 * 24) {
    return "text-red-500 dark:text-red-400";
  }
  if (days <= 7 * 24) {
    return "text-orange-500 dark:text-orange-400";
  }
  return "text-green-500 dark:text-green-400";
}

const TaskCard = ({ task }: { task: Task }) => {
  const [isLoading, startTransition] = useTransition();
  return (
    <div className="flex items-start gap-2">
      <Checkbox
        className="h-5 w-5"
        checked={task.done}
        disabled={task.done || isLoading}
        id={task.id.toString()}
        onCheckedChange={() => {
          startTransition(async () => {
            await setTaskToDone(task.id);
          });
        }}
      />
      <label
        htmlFor={task.id.toString()}
        className={cn(
          "text-sm leading-none font-medium decoration-1 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:decoration-white",
          task.done && "line-through",
        )}
      >
        {task.content}
        {task.expiresAt && (
          <p
            className={cn(
              "text-xs text-neutral-500 dark:text-neutral-400",
              getExpirationColor(task.expiresAt),
            )}
          >
            {format(task.expiresAt, "dd/MM/yyyy")}
          </p>
        )}{" "}
      </label>
    </div>
  );
};

export default TaskCard;
