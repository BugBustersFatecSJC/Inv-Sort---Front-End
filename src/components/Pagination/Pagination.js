import React from "react"
import { motion } from "framer-motion"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const generatePageNumbers = () => {
        const pageNumbers = []
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i)
        }

        return pageNumbers
    }

    return (
        <div className="flex justify-center items-center space-x-2 mt-4">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="shadow-none w-[2.4rem]">
                <img src="/img/arrow_left.png" alt="previous" />
            </button>

            {generatePageNumbers().map((page) => (
                <motion.p
                key={page}
                onClick={() => onPageChange(page)}
                className={`cursor-pointer ${
                    currentPage === page ? "quarternary-color font-bold text-lg" : "alt-color"
                }`}
                initial={currentPage === page ? { scale: 0.8 } : {}}
                animate={currentPage === page ? { scale: 1.2 } : { scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                {page}
                </motion.p>
            ))}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="shadow-none w-[2.4rem]">
                <img src="/img/arrow_right.png" alt="next" />
            </button>
        </div>
    )
}

export default Pagination