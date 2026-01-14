import PackageCard from "./PackageCard";

const PackageShowcase = ({
  packages,
  title = "Available Packages",
}) => {
  return (
    <div className="w-full flex justify-center mt-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm px-4 py-6 md:px-6 md:py-8">
        {/* Header with accent bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h2>
        </div>

        {/* Package Cards */}
        <div className="space-y-4">
          {packages.map((pkg, index) => (
            <PackageCard key={index} package={pkg} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageShowcase;
