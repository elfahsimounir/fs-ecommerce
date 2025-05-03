

const SectionHeader=({title,description,icon})=>{

    return (
        <div className="mb-7 " >
        <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
          <span className="text-primary">
          {icon&&icon}
          </span>
         {title&&title}
        </span>
        <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
         {description&&description}
        </h2>
      </div>
    )
}

export default SectionHeader;