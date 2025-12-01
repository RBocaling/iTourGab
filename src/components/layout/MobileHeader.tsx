import { MailSearch, Search } from 'lucide-react';
import React from 'react'
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const MobileHeader = () => {
  return (
    <div className="mobile-header  lg:hidden fixed top-0 left-0 w-full z-50 h-16 flex items-center justify-between px-2">
      <div className="flex items-center">
         <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gradient-primary"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className=" bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <img src="/logo-itour.png" className="w-14" alt="" />
                </motion.div>
            </motion.div>
        <p className="text-xl font-bold -translate-x-3">iTourGab</p>
      </div>
      <div className="flex items-center gap-5 pr-5">
        <Link to="/search">
          <Search size={23} className="text-gray-400" />
        </Link>
        <Link to="/gabaldon-public-socials">
          <MailSearch size={23} className="text-gray-400" />{" "}
        </Link>
      </div>
    </div>
  );
}

export default MobileHeader
