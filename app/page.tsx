"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from 'react';
import Dashboard from "@/components/Dashboard";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // If user is logged in, redirect to a different component
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <main className="bg-gray-100 min-h-screen pb-20">
      <header className="fixed top-0 right-0 z-30 flex justify-end items-center w-full border-b-4 border-orange-200 bg-orange-100 text-black h-16 px-4 space-x-4">
        <Link href={"/"} className="mr-auto font-bold text-xl text-orange-500">Heartthink</Link>
        <Link href={"/authenticate"} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">Let&apos;s get started</Link>
      </header>

      <section className="pt-24 px-8 mx-auto">
        <div className="flex items-center space-x-8 mb-8">
          <div className="bg-gray-300 px-8 py-28 text-center rounded-lg flex-1">
            <p className="text-lg italic">Place for image</p>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-orange-500">Discover the World of Heartthink</h1>
            <p className="text-lg">
              Dive into the intricacies of thought and emotion with our latest book, Heartthink.
            </p>
          </div>
        </div>

        <div className="mb-8 flex justify-center flex-col items-center">
          <p className="text-lg mb-4">
            This groundbreaking work explores the connection between the mind and heart,
            offering insights that will change the way you perceive the world. Don&apos;t miss
            out on the opportunity to transform your understanding. Grab your copy now and
            embark on a journey of discovery!
          </p>
          <div className=" bg-orange-500 text-white text-center py-4 w-1/3 rounded-md cursor-pointer hover:bg-orange-600">
            <p>Buy the Book</p>
          </div>
        </div>

        <div>
          <p className="text-lg mb-4 bg-orange-100 indent-12">
            By purchasing this book, you&apos;ll gain full access to exclusive content on this webpage.
            This secret content will not only enhance your reading experience but also provide additional
            tools and insights that you will appreciate as you delve deeper into the concepts of Heartthink.
          </p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed aspernatur saepe possimus ipsum dolorum, tenetur veritatis, laborum atque aliquid nihil dicta mollitia facere fugiat beatae quia ipsam nulla asperiores repellat? Molestias eaque dolores voluptas officiis perspiciatis ipsam nesciunt et placeat quis numquam.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium animi rem minima veniam fugiat iste nostrum. Laudantium doloribus suscipit doloremque, provident debitis veniam consequuntur ducimus. Repellendus nostrum ratione ducimus delectus eligendi, nobis exercitationem perferendis consectetur hic. Magni, consequatur placeat? Dolores quod accusamus beatae, ab voluptas laborum quos odio corrupti, laboriosam dicta molestiae! Voluptate, inventore totam ullam doloribus, eos error officiis quaerat nostrum quasi quo adipisci fuga nisi? Dolores cum ea nostrum voluptate, reprehenderit et necessitatibus, quisquam maxime modi pariatur mollitia facilis iusto quidem? Repellendus consequatur ullam porro assumenda nisi repudiandae quibusdam aspernatur iure labore harum deserunt, enim aliquam. Possimus excepturi dolor corporis veritatis eaque minus quas nam necessitatibus officia laboriosam. Saepe molestias suscipit repellendus culpa, esse a? Nam perferendis, delectus cupiditate praesentium consectetur amet. Perspiciatis optio veritatis nihil sunt corporis molestias vitae quibusdam adipisci fugiat dolore in dolorum sit aspernatur, ducimus asperiores. Porro sit ad debitis libero harum odit minima adipisci exercitationem voluptas velit architecto facilis, enim blanditiis error illum quo, dignissimos repellendus modi dolorem cumque temporibus excepturi! Eveniet doloremque saepe eius repellat inventore, rerum impedit, harum sapiente dolorem nemo incidunt nisi magnam, nostrum quia!</p>
          <div className="bg-gray-300 m-20 py-28 text-center rounded-lg flex-1">
            <p className="text-lg italic">Place for another image</p>
          </div>        
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum dignissimos ipsum, minima eaque nulla quis? Eaque officia atque doloribus commodi, magnam adipisci soluta dignissimos ipsa quo vel aperiam nam! Et, officia? Nobis dicta molestiae laudantium veniam maxime molestias aperiam praesentium velit, necessitatibus debitis quo nostrum quasi hic laboriosam libero aut quaerat culpa dolore impedit beatae cupiditate sed. Iste nobis, sint eius ex tempora aspernatur nulla similique. Praesentium officiis facilis quidem debitis suscipit. Accusamus temporibus sint fugiat ipsa nihil quas quaerat dignissimos consequatur officia facilis? Esse voluptate, nostrum iure aperiam doloremque sed est! Error unde rem delectus, qui ex cum, sed vel distinctio modi ratione ad.</p>
        </div>
      </section>
    </main>
  );
}
