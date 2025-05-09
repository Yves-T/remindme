import { UserButton } from "@clerk/nextjs";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

const NavBar = () => {
  return (
    <nav className="flex h-[60px] w-full items-center justify-between p-4 px-8">
      <Logo />
      <div className="flex items-center gap-4">
        <UserButton />
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default NavBar;
