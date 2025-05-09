import { ReactNode } from "react";

function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <div className="flex w-full grow justify-center dark:bg-neutral-950">
        <div className="flex max-w-[920px] grow flex-col px-4 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
