import Head from "next/head";
import { useState } from "react";

interface Note {
  title: string;
  tagline: string;
  body: string;
  isPinned: boolean;
}

export default function Home() {
  const [note, setNote] = useState<Note>({
    title: "",
    tagline: "",
    body: "",
    isPinned: false,
  });

  const onChnage = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  return (
    <>
      <Head>
        <title>Note Keep</title>
        <meta
          name="description"
          content="A note keeping nextjs appliction to help you organize your workflow"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex justify-center items-center min-h-screen">
        <div className=" flex flex-col justify-center items-center bg-violet-200 p-5 rounded-md shadow-md">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-600">Title</span>
            </label>
            <input
              name="title"
              onChange={onChnage}
              value={note.title}
              type="text"
              placeholder="Type here"
              className="input input-primary input-bordered w-full max-w-xs bg-transparent"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-600">Tagline</span>
            </label>
            <input
              name="tagline"
              onChange={onChnage}
              value={note.tagline}
              type="text"
              placeholder="Type here"
              className="input input-primary input-bordered w-full max-w-xs bg-transparent"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-600">Body</span>
            </label>
            <textarea
              name="body"
              onChange={onChnage}
              value={note.body}
              className="textarea textarea-primary textarea-bordered h-24 bg-transparent"
              placeholder="Bio"
            ></textarea>
          </div>
          <div className=" mt-4">
          <button className=" btn btn-primary">Save</button>

          </div>
        </div>
      </main>
    </>
  );
}
