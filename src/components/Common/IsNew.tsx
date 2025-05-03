

const IsNew = ({ inew }) => {
  return (
    <div
      className={`${
        inew ? "block" : "hidden"
      } absolute top-0 left-0 bg-secondary rounded-tl-lg rounded-br-lg text-white text-xs font-semibold px-2 py-[2px]`}
    >
      New
    </div>
  );
}
export default IsNew;