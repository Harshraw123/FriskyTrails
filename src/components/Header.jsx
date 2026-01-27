import Facebook from "../assets/facebook.svg";
import Linkedin from "../assets/linkedin.svg";
import Twitter from "../assets/twitter.svg";
import Instagram from "../assets/instagram.svg";
import Email from "../assets/email.svg";
import Call from "../assets/calling.svg";

const Header = () => {
  return (
    <>
      {/* Desktop / Tablet Header - Reduced height */}
      <div className="fixed hidden top-0 md:flex z-[1000] h-[5vh] sm:h-[6vh] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 w-full justify-between items-center px-8 xl:px-12 ">
        <div className="flex z-50 items-center gap-4 xl:gap-6">
          <div className="flex z-50 items-center gap-1.5 xl:gap-2">
            <img className="w-4 h-4 xl:w-5 xl:h-5" src={Email} alt="email" />
            <a href="mailto:contact@friskytrails.in" className="text-black text-xs xl:text-sm whitespace-nowrap">
              contact@friskytrails.in
            </a>
          </div>
          <div className="hidden md:block h-4 xl:h-5 border-l border-black/70" />
          <div className="flex items-center gap-1.5 xl:gap-2">
            <img className="w-4 h-4 xl:w-5 xl:h-5" src={Call} alt="call" />
            <a href="tel:+917501516714" className="text-black text-xs xl:text-sm whitespace-nowrap">
              +91-75015 16714
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 xl:gap-4">
          <span className="text-black text-xs xl:text-sm hidden lg:inline">Follow Us:</span>
          <div className="flex items-center gap-1.5 xl:gap-3">
            <a href="https://www.facebook.com/friskytrailscommunity/" target="_blank" rel="noopener noreferrer">
              <img className="w-4 h-4 xl:w-5 xl:h-5 hover:scale-110 transition-transform" src={Facebook} alt="Facebook" />
            </a>
            <div className="h-4 xl:h-5 border-l border-black/70" />
            <a href="https://x.com/frisky_trails" target="_blank" rel="noopener noreferrer">
              <img className="w-4 h-4 xl:w-5 xl:h-5 hover:scale-110 transition-transform" src={Twitter} alt="Twitter" />
            </a>
            <div className="h-4 xl:h-5 border-l border-black/70" />
            <a href="https://www.linkedin.com/company/friskytrailsofficial/" target="_blank" rel="noopener noreferrer">
              <img className="w-4 h-4 xl:w-5 xl:h-5 hover:scale-110 transition-transform" src={Linkedin} alt="LinkedIn" />
            </a>
            <div className="h-4 xl:h-5 border-l border-black/70" />
            <a href="https://www.instagram.com/friskytrails/" target="_blank" rel="noopener noreferrer">
              <img className="w-4 h-4 xl:w-5 xl:h-5 hover:scale-110 transition-transform" src={Instagram} alt="Instagram" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Header - Reduced height */}
      <div className="fixed md:hidden flex h-[5.2vh] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 z-[1000] w-full justify-between items-center px-3 py-1">
        <div className="flex items-center gap-1.5">
          <img className="w-4 h-4 flex-shrink-0" src={Call} alt="call" />
          <a href="tel:+917501516714" className="text-black text-xs font-medium">
            +91-75015 16714
          </a>
        </div>

        <div className="flex items-center gap-1">
          <a href="https://www.facebook.com/friskytrailscommunity/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <img className="w-4 h-4 hover:scale-110 transition-transform" src={Facebook} alt="Facebook" />
          </a>
          <div className="h-4 border-l border-black/70 mx-1" />
          <a href="https://x.com/frisky_trails" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <img className="w-4 h-4 hover:scale-110 transition-transform" src={Twitter} alt="Twitter" />
          </a>
          <div className="h-4 border-l border-black/70 mx-1" />
          <a href="https://www.linkedin.com/company/friskytrailsofficial/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <img className="w-4 h-4 hover:scale-110 transition-transform" src={Linkedin} alt="Linkedin" />
          </a>
          <div className="h-4 border-l border-black/70 mx-1" />
          <a href="https://www.instagram.com/friskytrails/" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <img className="w-4 h-4 hover:scale-110 transition-transform" src={Instagram} alt="Instagram" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
