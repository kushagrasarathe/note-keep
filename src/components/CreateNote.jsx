import { useEffect, useRef, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { db, notesCollectionRef } from "../configs/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
} from "@firebase/firestore";

import toast, { Toaster } from "react-hot-toast";
const notify = (msg) => toast.success(msg);

export default function CreateNote() {
  const [data, setData] = useState({
    title: "",
    tagline: "",
    body: "",
    isPinned: false,
  });

  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);

  const onFormChange = (event) => {
    const { name, value } = event.target;
    setData((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const saveNote = async () => {
    await addDoc(notesCollectionRef, data);
    setOpen(false);
    notify("Note Saved");
    // getPaginatedNotes();
  };
  return (
    <>
      <button
        onClick={() => setOpen((prevState) => !prevState)}
        className="btn btn-primary "
      >
        New Note
      </button>
      <Toaster position="top-center" />

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-md transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full max-w-md mx-auto items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="  relative transform overflow-hidden rounded-lg bg-gray-50 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className=" flex flex-col justify-center items-center p-5 rounded-md shadow-md">
                    <div className=" text-xl font-semibold my-3">
                      <h1>Enter Details</h1>
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text text-gray-600">Title</span>
                      </label>
                      <input
                        name="title"
                        onChange={onFormChange}
                        value={data.title}
                        type="text"
                        placeholder="Type here"
                        className="input input-primary input-bordered w-full max-w-xs bg-transparent"
                        required={true}
                      />
                    </div>
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text text-gray-600">
                          Tagline
                        </span>
                      </label>
                      <input
                        name="tagline"
                        onChange={onFormChange}
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
                        onChange={onFormChange}
                        value={data.body}
                        className="textarea textarea-primary textarea-bordered text-base h-24 bg-transparent"
                        placeholder="Bio"
                        required={true}
                      ></textarea>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="btn btn-primary mx-3"
                      onClick={saveNote}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      className="btn border-0 bg-red-600 text-white hover:bg-red-500"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
