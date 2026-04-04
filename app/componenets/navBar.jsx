import Link from "next/link";
import { GoBellFill } from "react-icons/go";
import { IoCogSharp } from "react-icons/io5";
import { HiLightningBolt } from "react-icons/hi";

export default function NavBar() {
  return (
    <nav>
      <div className="nav__container container nav-group">
        <div className="nav__group nav__logo">
          <img className="nav__logo-icon" src="/logo.svg" alt="" />
          <span className="nav__logo-txt">UniLock</span>
        </div>
        <div className="nav__group action__group">
          <Link className="action-link btn btn__primary" href="/" data-tooltip="Start Study Mode">
            <HiLightningBolt />
            <span>Study Mode</span>
          </Link>
          <Link className="action-link btn" href="/" data-tooltip="Go to Notifications">
            <GoBellFill />
          </Link>
          <Link className="action-link btn" href="/" data-tooltip="Modify Settings">
            <IoCogSharp />
          </Link>
          {/* Dynamic Profile image to display based on gender */}
          <Link className="action-link btn profile-pic" href="/">
            <img src="/male-avatar.svg" alt="Profile Pic" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
