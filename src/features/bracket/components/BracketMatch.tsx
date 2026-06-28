import { motion } from 'framer-motion';
import { Trophy, Users, Clock } from 'lucide-react';

export default function BracketMatch() {
  return (
    <motion.div
      className="card w-full p-3"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded bg-gray-100 p-2 dark:bg-dark-700">
          <span className="text-xs font-semibold">Equipo 1</span>
          <span className="text-sm font-bold text-primary">0</span>
        </div>
        <div className="flex items-center justify-center">
          <span className="text-xs text-gray-500">VS</span>
        </div>
        <div className="flex items-center justify-between rounded bg-gray-100 p-2 dark:bg-dark-700">
          <span className="text-xs font-semibold">Equipo 2</span>
          <span className="text-sm font-bold text-primary">0</span>
        </div>
      </div>
    </motion.div>
  );
}
