import { doc, updateDoc } from "@firebase/firestore";
import UpdateNote from "./UpdateNote";
import { useState } from "react";
import { db } from "../configs/firebaseConfig";
import { FetchNotes } from "../hooks/useFetchNotes";
import { toast } from "react-hot-toast";
import Image from "next/image";

const notify = (msg) => toast.success(msg);

export default function NoteCard({
  data,
  deleteNote,
  setUpdate,
  isNotePinned,
}) {
  const [pin, setPin] = useState(false);

  const pinNote = async (docID) => {
    const docRef = doc(db, "notes", docID);
    await updateDoc(docRef, { isPinned: !data.isPinned });
    notify(`Note ${data.isPinned ? "Un-Pinned" : "Pinned"}`);
    isNotePinned((prev) => !prev);
  };

  return (
    <div className="w-full  p-1 cursor-pointer">
      <div className="bg-white shadow-lg  rounded-md">
        <div className="bg-grey-lightest border-b p-4 flex items-center">
          <div className="flex-1 text-grey text-lg font-bold">{data.title}</div>
          <div
            onClick={() => {
              //   setPin((prev) => !prev);
              pinNote(data.id);
            }}
            className="mr-2 text-sm text-grey-darkest"
          >
            {data.isPinned === true ? (
              <Image
                alt="pinned"
                width={20}
                height={20}
                src="https://img.icons8.com/ios-filled/50/null/pin--v1.png"
              />
            ) : (
              <Image
                width={20}
                height={20}
                src="https://img.icons8.com/ios/50/null/pin--v1.png"
                alt="pinned"
              />
            )}
          </div>
        </div>

        <div className="p-4 leading-normal">
          <p className=" font-semibold">{data.tagline}</p>
          <p>{data.body}</p>
        </div>

        <div className="bg-grey-lightest border-t p-4 text-sm text-right">
          <button onClick={deleteNote} className=" btn btn-ghost mx-2">
            Delete
          </button>
          <UpdateNote setUpdate={setUpdate} documentId={data.id} />
        </div>
      </div>
    </div>
  );
}
