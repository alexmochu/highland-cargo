
const ComingSoon = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-blue-50 to-white">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">Coming Soon</h1>
        <p className="text-xl text-gray-700 mb-6">
          This page or feature is under construction. Check back soon!
        </p>
        <span className="inline-block mt-2 text-sm text-gray-400">Highland Cargo &copy; {new Date().getFullYear()}</span>
      </div>
    </div>
  );
  
  export default ComingSoon;
  