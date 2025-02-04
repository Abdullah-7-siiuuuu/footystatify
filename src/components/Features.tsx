import { motion } from "framer-motion";
import { BarChart3, Users, Trophy, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Match Statistics",
    description: "Comprehensive match data including possession, shots, passes, and more.",
  },
  {
    icon: Users,
    title: "Player Analysis",
    description: "Compare players across different metrics and track their performance.",
  },
  {
    icon: Trophy,
    title: "Team Rankings",
    description: "Up-to-date team rankings and performance analytics across leagues.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-secondary rounded-full">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Advanced Football Analytics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access detailed statistics and insights to understand the beautiful game better.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-lg hover-lift"
            >
              <feature.icon className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <button className="group flex items-center text-primary">
                Learn more
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};