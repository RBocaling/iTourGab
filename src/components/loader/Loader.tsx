import { PropagateLoader } from "react-spinners";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 z-[999999] h-screen w-full flex flex-col items-center justify-center">
      <div className="max-w-xs w-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gradient-primary"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className=" bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <img src="/logo-itour.png" className="w-32" alt="" />
          </motion.div>
        </motion.div>
        <PropagateLoader color="#2DCEFE" size={19} />
      </div>
    </div>
  );
}

export default Loader
