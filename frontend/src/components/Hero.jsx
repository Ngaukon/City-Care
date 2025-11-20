export default function HeroCard() {
  return (
    <div className="w-full flex justify-center mt-6 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl w-full border border-gray-200 text-center">
        {/* text-center centers all text inside the card */}
        <h2 className="text-2xl font-bold text-blue-700 mb-2">
          Welcome to CityCare
        </h2>

        <p className="text-gray-600 leading-relaxed">
          CityCare is a community-driven platform that empowers residents to 
          report issues such as waste disposal problems, damaged public 
          infrastructure, and environmental hazards. Together, we support 
          <span className="font-semibold text-blue-600">
            {" "}SDG 11: Sustainable Cities & Communities.
          </span>
        </p>

        <div className="mt-4 flex justify-center gap-4">
          <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
          <div className="h-3 w-3 bg-green-500 rounded-full"></div>
          <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
