import Facebook from "../assets/facebook.svg";
import Linkedin from "../assets/linkedin.svg";
import Twitter from "../assets/twitter.svg";
import Instagram from "../assets/instagram.svg";
import Email from "../assets/email.svg";
import Call from "../assets/calling.svg";

const Header = () => {
  return (
    <>
      {/* Desktop / Tablet Header */}
      <div className="fixed hidden top-0 md:flex z-[1000] h-[6vh] bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 w-full justify-between items-center px-12">
        <div className="flex z-50 items-center gap-6">
          <div className="flex z-50 items-center gap-2">
            <img className="w-5 md:hidden lg:block h-5" src={Email} alt="email" />
            <a href="mailto:contact@friskytrails.in" className="text-black md:hidden lg:block">
              contact@friskytrails.in
            </a>
          </div>
          <div className="md:hidden lg:block h-5 border-l border-black" />
          <div className="flex items-center gap-2">
            <img className="w-5 h-5" src={Call} alt="call" />
            <a href="tel:+917501516714" className="text-black">
              +91-75015 16714
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-black">Follow Us On:</span>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/friskytrailscommunity/" target="_blank" rel="noopener noreferrer">
              <img className="w-5 h-5" src={Facebook} alt="Facebook" />
            </a>
            <div className="h-5 border-l border-black" />
            <a href="https://x.com/frisky_trails" target="_blank" rel="noopener noreferrer">
              <img className="w-5 h-5" src={Twitter} alt="Twitter" />
            </a>
            <div className="h-5 border-l border-black" />
            <a href="https://www.linkedin.com/company/friskytrailsofficial/" target="_blank" rel="noopener noreferrer">
              <img className="w-5 h-5" src={Linkedin} alt="LinkedIn" />
            </a>
            <div className="h-5 border-l border-black" />
            <a href="https://www.instagram.com/friskytrails/" target="_blank" rel="noopener noreferrer">
              <img className="w-5 h-5" src={Instagram} alt="Instagram" />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="fixed  md:hidden flex h-[6vh] z-[1000] w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <img className="w-5 h-5" src={Call} alt="call" />
          <a href="tel:+917501516714" className="text-black text-sm">
            Call Us
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a href="https://www.facebook.com/friskytrailscommunity/" target="_blank" rel="noopener noreferrer">
            <img className="w-5 h-5" src={Facebook} alt="Facebook" />
          </a>
          <div className="h-5 border-l border-black" />
          <a href="https://x.com/frisky_trails" target="_blank" rel="noopener noreferrer">
            <img className="w-5 h-5" src={Twitter} alt="Twitter" />
          </a>
          <div className="h-5 border-l border-black" />
          <a href="https://www.linkedin.com/company/friskytrailsofficial/" target="_blank" rel="noopener noreferrer">
            <img className="w-5 h-5" src={Linkedin} alt="Linkedin" />
          </a>
          <div className="h-5 border-l border-black" />
          <a href="https://www.instagram.com/friskytrails/" target="_blank" rel="noopener noreferrer">
            <img className="w-5 h-5" src={Instagram} alt="Instagram" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
