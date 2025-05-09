"use client";

import { useState } from "react";
import CreateCollectionSheet from "./CreateCollectionSheet";
import { Button } from "./ui/button";

const CreateCollectionBtn = () => {
  const [open, setOpen] = useState(false);
  const handleOpenchange = (open: boolean) => setOpen(open);

  return (
    <div>
      <div className="w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[1px]">
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="w-full bg-white dark:bg-neutral-950 dark:text-white"
        >
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent hover:to-orange-800">
            Create collection
          </span>
        </Button>
      </div>
      <CreateCollectionSheet open={open} onOpenChange={handleOpenchange} />
    </div>
  );
};

export default CreateCollectionBtn;
