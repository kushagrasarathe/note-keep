import toast, { Toaster } from "react-hot-toast";

const notify = (msg) => toast(msg);

export default function Toast({ message }) {
  return (
    <div>
      <button onClick={(message) => notify(message)}>Make me a toast</button>
      <Toaster />
    </div>
  );
}
