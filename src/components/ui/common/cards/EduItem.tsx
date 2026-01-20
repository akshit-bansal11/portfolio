"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EduItemProps {
    location: string;
    company: string;
    role: string;
    date: string;
    // Note: 'company' prop name might be 'institution' theoretically, but keeping as per JS source: 'company'
}

export default function EduItem({ location, company, role, date }: EduItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full"
        >
            <Card className="border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/60 hover:border-neutral-700 transition-all duration-300">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-clash font-semibold text-white tracking-wide mb-1">{company}</h3>
                            <p className="text-neutral-300 font-medium">{role}</p>
                        </div>
                        <div className="flex flex-col md:items-end gap-2 text-sm text-neutral-400">
                            <Badge variant="outline" className="w-fit gap-2 border-neutral-700 text-neutral-400 font-normal">
                                <FaCalendarAlt className="h-3 w-3" />
                                {date}
                            </Badge>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="h-3 w-3" />
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};
