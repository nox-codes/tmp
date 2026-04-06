import Link from "next/link";
import Image from "next/image";
import { GoBellFill } from "react-icons/go";
import { IoCogSharp } from "react-icons/io5";
import { HiLightningBolt } from "react-icons/hi";

export default function NavBar() {
  return (
    <nav className="landing-nav">
      <div className="nav-container">
        <Link href="/" className="nav__logo">
            <Image width={32} height={32} src="/logo.svg" alt="UniLock" />
            <span className="nav__logo-text">UniLock</span>
        </Link>
        <div className="nav__actions">
          <Link className="btn btn-primary" href="/" data-tooltip="Start Study Mode">
            <HiLightningBolt />
            <span>Study Mode</span>
          </Link>
          <Link className="btn btn-ghost" href="/" data-tooltip="Go to Notifications">
            <GoBellFill />
          </Link>
          <Link className="btn btn-ghost" href="/" data-tooltip="Modify Settings">
            <IoCogSharp />
          </Link>
          {/* Dynamic Profile image to display based on gender */}
          <Link className="btn profile-pic" href="/">
            <Image width={56} height={56} src="/male-avatar.svg" alt="Profile Pic" />
          </Link>
        </div>
      </div>
    </nav>        

  );
}
