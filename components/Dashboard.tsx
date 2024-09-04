import Link from "next/link";

export default function Instructions() {
  return (
    <main className="bg-gray-100 min-h-screen pb-20">
      <header className="fixed top-0 right-0 z-30 flex justify-end items-center w-full border-b-4 border-orange-200 bg-orange-100 text-black h-16 px-4 space-x-4">
        <Link href={"/"} className="mr-auto font-bold text-xl text-orange-500">
          HeartThink
        </Link>
      </header>

      <section className="pt-24 px-8 mx-auto">
        <div className="flex items-center space-x-8 mb-8">
          <div className="bg-gray-300 px-8 py-28 text-center rounded-lg flex-1">
            <p className="text-lg italic">Place for image</p>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-orange-500">
              How to Use HeartThink
            </h1>
            <p className="text-lg">
              Follow these instructions for the best experience using HeartThink.
            </p>
          </div>
        </div>

        <div className="mb-8 flex justify-center flex-col items-center">
          <p className="text-lg mb-4">
            To ensure optimal results, make sure you carefully read and follow all instructions provided on this page. These guidelines are designed to help you navigate and fully utilize the features available.
          </p>
          <div className="bg-orange-500 text-white text-center py-4 w-1/3 rounded-md cursor-pointer hover:bg-orange-600">
            <p>Start Now</p>
          </div>
        </div>

        <div>
          <p className="text-lg mb-4 bg-orange-100 indent-12">
            For the best results, please ensure that you have completed all necessary preparations. Double-check your settings and familiarize yourself with the interface to avoid any issues.
          </p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.</p>
          <div className="bg-gray-300 m-20 py-28 text-center rounded-lg flex-1">
            <p className="text-lg italic">Place for another image</p>
          </div>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.</p>
        </div>
      </section>
    </main>
  );
}
