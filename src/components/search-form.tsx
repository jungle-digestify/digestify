import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { redirect } from "next/navigation";
const searchActionCheck = async (formdata: FormData) => {
  "use server";
  const query = formdata.get("search");
  // console.log(query);
  if (typeof query !== "string") {
    return;
  }

  redirect(`?search=${encodeURIComponent(query)}`);
};

export const SearchForm = ({ search }: { search?: string }) => {
  return (
    <form className="space-y-2" action={searchActionCheck}>
      <div className="relative">
        <Search className="absolute left-3 top-[10px] h-5 w-5 text-muted-foreground" />
        <Input
          name="search"
          placeholder="Search"
          className="pl-9 h-10 text-lg"
          defaultValue={search}
        />
      </div>
    </form>
  );
};

// client component로 만드는 것은 포기한다.
// "use client";

// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { useState, useTransition } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";

// import { NewPasswordSchema, SearchSchema } from "@/zod-schemas";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { searchAction } from "@/actions/search";
// import { Search } from "lucide-react";

// export const SearchForm = () => {
//   const [error, setError] = useState<string | undefined>("");
//   const [success, setSuccess] = useState<string | undefined>("");
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<z.infer<typeof SearchSchema>>({
//     resolver: zodResolver(SearchSchema),
//     defaultValues: {
//       query: "",
//     },
//   });

//   const onSubmit = (values: z.infer<typeof SearchSchema>) => {
//     setError("");
//     setSuccess("");

//     startTransition(() => {
//       searchAction(values).then((data) => {
//         setError(data?.error);
//         setSuccess(data?.success);
//       });
//     });
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="space-y-4">
//           <FormField
//             control={form.control}
//             name="query"
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-[10px] h-5 w-5 text-muted-foreground" />
//                     <Input
//                       {...field}
//                       disabled={isPending}
//                       placeholder="Search"
//                       className="pl-9 h-10 text-lg"
//                     />
//                   </div>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         </div>
//       </form>
//     </Form>
//   );
// };
