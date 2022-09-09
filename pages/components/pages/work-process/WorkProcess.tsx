import type { FC } from 'react';
import styles from './WorkProcess.module.css';

interface IWorkProcess {
  title: string;
  description: string;
}

const WORK_PROCESSES: IWorkProcess[] = [
  {
    title: 'Create your account and fill your interests',
    description:
      'Create your account and fill your personal information and interests with a beautiful profile photos.',
  },
  {
    title: 'Find your matches and send request',
    description: 'Find your matching partners with your interests and send a friend request for a chat.',
  },
  {
    title: 'Impress your matching partners',
    description: 'Chat with your matching partners and talk about life and impress them.',
  },
];

export const WorkProcess: FC = () => {
  return (
    <section className="container py-20">
      <h2 className="text-h2 text-center font-serif font-black mb-8">How it works?</h2>
      <div className="flex gap-5 flex-col md:flex-row">
        {WORK_PROCESSES.map((process, index) => (
          <div key={index}>
            <span className={styles.stepPill}>Step {index + 1}</span>
            <h3 className="text-h3 font-serif font-bold mt-4 mb-2">{process.title}</h3>
            <p className="text-muted text-sm">{process.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
