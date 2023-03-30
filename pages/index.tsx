import { db } from "@/src/configs/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";
import Head from "next/head";
import { useEffect, useState } from "react";

const notesCollectionRef = collection(db, "notes");

interface Note {
  id?: string;
  title: string;
  tagline: string;
  body: string;
  isPinned: boolean;
}

export default function Home() {
  const [data, setData] = useState<Note>({
    title: "",
    tagline: "",
    body: "",
    isPinned: false,
  });

  const [fetchedNotes, setFetchedNotes] = useState<any[]>([]);
  const [notes, setNotes] = useState([]);
  const [lastNote, setLastNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const notesPerPage = 6;
  const pageCount = Math.ceil(notes.length / notesPerPage);

  useEffect(() => {
    const fetchNotes = async () => {
      const q = query(
        notesCollectionRef,
        // orderBy("title"),
        limit(notesPerPage)
      );

      const snapshot = await getDocs(q);
      // Query the first page of docs
      const first = query(collection(db, "notes"), orderBy("title"), limit(6));
      const documentSnapshots = await getDocs(first);
      const data = documentSnapshots.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(data)

      // console.log(documentSnapshots)
      // Get the last visible document
      const lastVisible =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      console.log("last", lastVisible);
      // const notesRef = db
      //   .collection("notes")
      //   .orderBy("createdAt", "desc")
      //   .limit(notesPerPage);
      // const snapshot = await notesRef.get();
      // const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // setNotes(data);
      // setLastNote(snapshot.docs[snapshot.docs.length - 1]);
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    getNotes();
  }, []);

  const onChnage = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement;
    setData((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const getNotes = async () => {
    const data = await getDocs(notesCollectionRef);
    // setFetchedNotes(data.docs.map((doc) => doc.data()));
    setFetchedNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    onSnapshot(notesCollectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFetchedNotes(data);
    });
  };

  // console.log(fetchedNotes);

  const saveNote = async () => {
    console.log(data);
    await addDoc(notesCollectionRef, data);
    // getNotes();
  };

  const deleteNote = async (id: string) => {
    const noteDoc = doc(db, "notes", id);
    await deleteDoc(noteDoc);
    // getNotes();
  };

  return (
    <>
      <Head>
        <title>Note Keep</title>
        <meta
          name="description"
          content="A data keeping nextjs appliction to help you organize your workflow"
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
              value={data.title}
              type="text"
              placeholder="Type here"
              className="input input-primary input-bordered w-full max-w-xs bg-transparent"
              required={true}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-600">Tagline</span>
            </label>
            <input
              name="tagline"
              onChange={onChnage}
              value={data.tagline}
              type="text"
              placeholder="Type here"
              className="input input-primary input-bordered w-full max-w-xs bg-transparent"
              required={true}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-gray-600">Body</span>
            </label>
            <textarea
              name="body"
              onChange={onChnage}
              value={data.body}
              className="textarea textarea-primary textarea-bordered text-base h-24 bg-transparent"
              placeholder="Bio"
              required={true}
            ></textarea>
          </div>
          <div className=" mt-4 flex flex-col">
            <button className=" btn btn-primary m-2" onClick={saveNote}>
              Save
            </button>
            <button className=" btn btn-primary m-2" onClick={getNotes}>
              getNotes
            </button>
          </div>
        </div>
      </main>

      <div className=" grid grid-cols-3 gap-10 px-10 pb-40">
        {fetchedNotes.map((data: any, idx: number) => (
          <div
            key={idx}
            className=" cursor-pointer col-span-1 card w-96 bg-violet-300 shadow-xl"
          >
            <div className="card-body">
              <h2 className="card-title">{data.title}</h2>
              <p>{data.tagline}</p>
              <p>{data.body}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Edit</button>
                <button
                  onClick={() => deleteNote(data.id)}
                  className="btn bg-red-600 text-white border-0 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* <div className="btn-group col-span-3 mx-auto">
          <button className="btn">1</button>
          <button className="btn btn-active">2</button>
          <button className="btn">3</button>
          <button className="btn">4</button>
        </div> */}
      </div>
    </>
  );
}

// export const getServerSideProps = async () => {
//   let kushagra: Note[] = [];
//   try {
//     const data = await getDocs(notesCollectionRef);
//     data.forEach((doc) => {
//       console.log(doc.data().id);
//       kushagra.push({
//         id: doc.id,
//         title: doc.data().title,
//         tagline: doc.data().tagline,
//         body: doc.data().body,
//         isPinned: doc.data().isPinned,
//       });
//     });
//   } catch (error) {
//     console.log(error);
//   }

//   return {
//     props: {
//       kushagra,
//     },
//   };
// };
