import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

export default async function GoogleDriveClone(){
  return <div>
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </div>
}