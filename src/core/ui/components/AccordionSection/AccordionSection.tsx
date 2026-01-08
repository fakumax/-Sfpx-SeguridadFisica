import * as React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import styles from './AccordionSection.module.scss';
interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  preExpanded?: string[];
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  children,
  preExpanded = [],
}) => {
  const sectionId = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <Accordion allowZeroExpanded className={styles.accordion} preExpanded={preExpanded}>
      <AccordionItem uuid={sectionId}>
        <AccordionItemHeading>
          <AccordionItemButton className={styles.accordionButton}>
            <div className={styles.titleContainer}>
              <h2 className={styles.sectionTitle}>{title}</h2>
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>{children}</AccordionItemPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionSection;
