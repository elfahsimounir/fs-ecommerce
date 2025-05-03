

const Button = ({ children, onClick }) => {
    return (
      <button onClick={onClick} 
      className="flex border-gray-2 border-[1px] items-center justify-center duration-300 ease-in-out  hover:bg-gray-2 w-8 h-8 bg-gray-1 rounded-md">
        {children}
      </button>
    );
  }

  export default Button;