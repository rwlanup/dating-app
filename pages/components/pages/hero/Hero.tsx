import Image from 'next/image';
import type { FC } from 'react';
import { Button } from '../../ui/button/Button';
import HeroIllustration from '../../../../public/images/hero-illustration.svg';
import { mergeClasses } from '../../../../string';
import styles from './Hero.module.css';

export const Hero: FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={mergeClasses('container', styles.heroContainer)}>
        <div className="max-w-xl">
          <h1 className="text-h2 lg:text-h1 font-serif font-black mb-8">
            It&apos;s never too late to find your soulmate.
          </h1>
          <p className="md:w-4/5 text-muted text-h3 font-serif font-bold">
            Tell us about your interest and find your matching soulmates. It&apos;s never too late to fall in love
            again. Find your real feelings.
          </p>
          <Button
            href="/register"
            className="mt-10"
          >
            Create account
          </Button>
        </div>
        <div className={styles.imageContainer}>
          <Image
            priority
            src={HeroIllustration}
            alt="Happy dating online in Ditto platform"
          />
        </div>
      </div>
    </section>
  );
};
