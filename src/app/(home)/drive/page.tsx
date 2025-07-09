import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { MUTATIONS, QUERIES } from "~/server/db/queries";

export default async function DrivePage() {
  const session = await auth();

  if (!session.userId) {
    return redirect("/sign-in");
  }

  const rootFolder = await QUERIES.getRootFolderForUser(session.userId);

  if (!rootFolder) {
    return (
      <form
        action={async () => {
          "use server";
          const session = await auth();

          if (!session.userId) {
            return redirect("/sign-in");
          }

          const rootFolderId = await MUTATIONS.onboardUser(session.userId);

          return redirect(`/f/${rootFolderId}`);
        }}
      >
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 transform hover:scale-105">
        Create new Drive
        </Button>
      </form>
    );
  }

  return redirect(`/f/${rootFolder.id}`);
}