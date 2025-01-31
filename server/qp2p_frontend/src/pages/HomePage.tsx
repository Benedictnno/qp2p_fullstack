import { MdOutlineAutoFixHigh } from "react-icons/md";
import { GrConnect } from "react-icons/gr";
import { GiTrade } from "react-icons/gi";
import { SiFuturelearn } from "react-icons/si";
import { FlipWords } from "@/components/ui/flip-words";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Automate",
    description:
      "Leverage our platform to automate the peer-to-peer trading process effortlessly.",
    icon: <MdOutlineAutoFixHigh size={22} />,
  },
  {
    title: "Connect",
    description: "Seamlessly link buyers and sellers for secure transactions.",
    icon: <GrConnect size={22} />,
  },
  {
    title: "Trade",
    description:
      "Enjoy fast, efficient, and transparent trading without intermediaries.",
    icon: <GiTrade size={22} />,
  },
  {
    title: "Earn",
    description:
      "Grow your income by taking advantage of our innovative P2P system.",
    icon: <SiFuturelearn size={22} />,
  },
];

const testimonials = [
  {
    name: "Jane Doe",
    feedback:
      "QP2P revolutionized how I trade cryptocurrency. The automation and security are unmatched!",
    role: "Crypto Trader",
  },
  {
    name: "John Smith",
    feedback:
      "I love how seamless the platform is. Connecting with buyers and sellers has never been easier.",
    role: "Crypto Entrepreneur",
  },
  {
    name: "Emily Johnson",
    feedback:
      "The support team is amazing, and the system is so easy to use. Highly recommend QP2P!",
    role: "Entrepreneur",
  },
];
function HomePage() {
  return (
    <>
      {/* Header Section */}
      <header className="bg-gray-50 py-16">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome to <span className="text-blue-600">QP2P</span>:
          </h1>
          <h1 className="text-4xl font-bold text-gray-800">
            <FlipWords
              words={[
                "Automating Peer-to-Peer Crypto Trading",
                "Secure, Fast, and Automated P2P Transactions",
                "Fast, Secure, and Transparent: Trade P2P",
                "Designed for Traders, Built with Innovation",
                "Start Trading Smarter Today with QP2P",
              ]}
              duration={5000}
              className="z-0"
            />
          </h1>
          <p className="text-gray-600 mt-4">
            Revolutionize your trading experience with QP2P, the platform that
            simplifies, secures, and streamlines peer-to-peer transactions.
          </p>
          <div className="mt-8 space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Link to={"/sign-up"} className="text-slate-50">
                Get Started
              </Link>
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>
      </header>

      {/* Steps Section */}
      <section className=" text-white">
        <div className="container py-16 rounded-xl  bg-blue-600 mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center px-4">
          {steps.map((step, index) => (
            <div key={index} className="space-y-2 ">
              <h2 className="text-lg font-semibold flex justify-center gap-3">
                <span> {step.title}</span> <span>{step.icon}</span>
              </h2>
              <p className="text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800">Why Choose QP2P?</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            QP2P combines cutting-edge technology with user-centric design to
            deliver an unparalleled trading experience. Say goodbye to manual
            processes and hello to automation.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-md p-6 rounded-md">
              <h3 className="text-lg font-bold">Secure Transactions</h3>
              <p className="text-gray-600">
                Our platform ensures every trade is safe and transparent.
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-md">
              <h3 className="text-lg font-bold">Fast Automation</h3>
              <p className="text-gray-600">
                Automate every step of the process for quicker trades.
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-md">
              <h3 className="text-lg font-bold">24/7 Support</h3>
              <p className="text-gray-600">
                Our team is always ready to assist with any queries or issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800">
            What Our Users Are Saying
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Hear from traders who have transformed their P2P experience with
            QP2P.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white shadow-md p-6 rounded-md">
                <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
                <h3 className="text-lg font-bold mt-4">{testimonial.name}</h3>
                <p className="text-sm text-blue-600">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-center">
            Find answers to common questions about using QP2P.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white shadow-md p-6 rounded-md">
              <h3 className="text-lg font-bold">What is QP2P?</h3>
              <p className="text-gray-600">
                QP2P is a peer-to-peer crypto trading platform that automates
                the entire process for secure and efficient transactions.
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-md">
              <h3 className="text-lg font-bold">How do I get started?</h3>
              <p className="text-gray-600">
                Simply sign up, verify your account, and start trading on our
                easy-to-use platform.
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-md">
              <h3 className="text-lg font-bold">Is QP2P secure?</h3>
              <p className="text-gray-600">
                Yes, we prioritize security and use advanced encryption to
                protect all transactions and user data.
              </p>
            </div>
            <div className="bg-white shadow-md p-6 rounded-md">
              <h3 className="text-lg font-bold">What fees are involved?</h3>
              <p className="text-gray-600">
                Our fees are competitive and fully transparent. Visit our
                pricing page for detailed information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold">
            Ready to Automate Your P2P Trading?
          </h2>
          <p className="text-white mt-4 max-w-2xl mx-auto">
            Join QP2P today and experience the future of peer-to-peer crypto
            trading. Sign up now and start trading smarter.
          </p>
          <button className="mt-6 px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100">
            <Link to={"/sign-up"} className="">
              Sign Up Now
            </Link>
          </button>
        </div>
      </section>
    </>
  );
}

export default HomePage;
