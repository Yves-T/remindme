import { createCollection } from "@/actions/collection";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  createCollectionSchema,
  createCollectionSchemType,
} from "@/schema/createCollection";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

type Props = { open: boolean; onOpenChange: (open: boolean) => void };
const CreateCollectionSheet = ({ open, onOpenChange }: Props) => {
  const form = useForm<createCollectionSchemType>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: { color: "", name: "" },
  });

  const onSubmit = async (data: createCollectionSchemType) => {
    try {
      await createCollection(data);
      openChangeWrapper(false);

      toast("Collection created successfully! ");
    } catch (error) {
      toast.error("Something went wrong. Please try again later ");
      console.error(error);
    }
  };

  const openChangeWrapper = (open: boolean) => {
    form.reset();
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={openChangeWrapper}>
      <SheetTrigger></SheetTrigger>
      <SheetContent className="p-2">
        <SheetTitle>Add new collection</SheetTitle>
        <SheetDescription>
          Collections are a way to group your tasks
        </SheetDescription>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Personal" {...field} />
                  </FormControl>
                  <FormDescription>Collection name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger
                        className={cn(
                          "h-8 w-full dark:text-white",
                          CollectionColors[field.value as CollectionColor],
                        )}
                      >
                        <SelectValue
                          placeholder="Color"
                          className="h-8 w-full"
                        ></SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-full">
                        {Object.keys(CollectionColors).map((color) => (
                          <SelectItem
                            key={color}
                            value={color}
                            className={cn(
                              `my-1 h-8 w-full rounded-md ring-neutral-600 focus:px-8 focus:font-bold focus:text-white focus:ring-2 focus:ring-inset dark:text-white dark:focus:ring-white`,
                              CollectionColors[color as CollectionColor],
                            )}
                          >
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a color for your collection
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="mt-4 flex flex-col gap-3">
          <Separator />
          <Button
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
            className={cn(
              form.watch("color") &&
                CollectionColors[form.getValues("color") as CollectionColor],
            )}
          >
            Confirm
            {form.formState.isSubmitting && (
              <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCollectionSheet;
