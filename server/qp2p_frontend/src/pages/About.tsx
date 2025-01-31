import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Styled container for the About page
const AboutContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 3rem;
  color: #0a1334;
  margin-bottom: 1rem;
`;

const SubHeading = styled.h2`
  font-size: 1.8rem;
  color: #555;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  text-align: left;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.8;
  color: #333;
  margin-bottom: 1.5rem;
`;

const Highlight = styled.span`
  color: #0066cc;
  font-weight: bold;
`;

const List = styled.ul`
  margin-top: 1rem;
  padding-left: 1.5rem;
  text-align: left;
  color: #333;
  list-style-type: disc;
`;

// const TeamSection = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-between;
//   gap: 1.5rem;
//   margin-top: 2rem;
// `;

// const TeamMember = styled.div`
//   flex: 1 1 calc(33.333% - 1rem);
//   background: #f9f9f9;
//   padding: 1rem;
//   border-radius: 0.5rem;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//   text-align: center;
// `;

// const TeamImage = styled.img`
//   width: 100px;
//   height: 100px;
//   border-radius: 50%;
//   margin-bottom: 1rem;
// `;

const CallToAction = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background: #0066cc;
  color: #fff;
  
  border-radius: 0.5rem;
  text-align: center;

  button {
    margin-top: 1rem;
    padding: 0.8rem 2rem;
    background: #fff;
    color: #0066cc;
    font-weight: bold;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;

    &:hover {
      background: #e6e6e6;
    }
  }
`;

const AboutPage: React.FC = () => {
  return (
    <AboutContainer>
      <Heading>About Us</Heading>
      <SubHeading>Revolutionizing Peer-to-Peer Crypto Trading</SubHeading>

      {/* Introduction */}
      <Section>
        <Paragraph>
          Welcome to <Highlight>QP2P</Highlight>, where we are redefining the
          way crypto enthusiasts trade in a peer-to-peer environment. Our goal
          is simple: to provide a <Highlight>secure</Highlight>,{" "}
          <Highlight>automated</Highlight>, and{" "}
          <Highlight>user-friendly</Highlight> trading platform that connects
          buyers and sellers effortlessly. With the global rise of
          cryptocurrency, we recognized the need for a platform that eliminates
          the barriers of traditional trading and unlocks limitless
          possibilities for users worldwide.
        </Paragraph>
      </Section>

      {/* Our Mission */}
      <Section>
        <SubHeading>Our Mission</SubHeading>
        <Paragraph>
          At QP2P, our mission is to empower users with tools and technologies
          that make crypto trading
          <Highlight> simple</Highlight>, <Highlight>transparent</Highlight>,
          and accessible to everyone. We strive to build trust in the blockchain
          ecosystem by fostering a secure environment where users can trade
          freely without intermediaries.
        </Paragraph>
      </Section>

      {/* Our Vision */}
      <Section>
        <SubHeading>Our Vision</SubHeading>
        <Paragraph>
          We envision a future where peer-to-peer trading becomes the standard
          for all cryptocurrency transactions. Our platform is designed to lead
          the way, embracing the values of decentralization, security, and
          innovation.
        </Paragraph>
      </Section>

      {/* Core Values */}
      <Section>
        <SubHeading>Core Values</SubHeading>
        <Paragraph>We are guided by the following principles:</Paragraph>
        <List>
          <li>
            <Highlight>Integrity</Highlight>: Building trust through
            transparency and ethical practices.
          </li>
          <li>
            <Highlight>Innovation</Highlight>: Leveraging cutting-edge
            technology to stay ahead of the curve.
          </li>
          <li>
            <Highlight>Security</Highlight>: Prioritizing the safety of user
            data and transactions.
          </li>
          <li>
            <Highlight>User-Centricity</Highlight>: Designing with the user in
            mind, ensuring a seamless experience.
          </li>
        </List>
      </Section>

      {/* Meet the Team */}
      {/* <Section>
        <SubHeading>Meet the Team</SubHeading>
        <Paragraph>
          QP2P is powered by a passionate and talented team of blockchain
          experts, developers, and customer support professionals. Together, we
          are committed to delivering the best trading experience to our users.
        </Paragraph>
        <TeamSection>
          <TeamMember>
            <TeamImage src="/images/team1.jpg" alt="Team Member" />
            <h4>John Doe</h4>
            <p>CEO & Founder</p>
          </TeamMember>
          <TeamMember>
            <TeamImage src="/images/team2.jpg" alt="Team Member" />
            <h4>Jane Smith</h4>
            <p>Head of Operations</p>
          </TeamMember>
          <TeamMember>
            <TeamImage src="/images/team3.jpg" alt="Team Member" />
            <h4>Michael Brown</h4>
            <p>Lead Developer</p>
          </TeamMember>
        </TeamSection>
      </Section> */}

      {/* Call to Action */}
      <CallToAction>
        <h2 className="text-lg font-semibold ">
          Ready to Join the Revolution?
        </h2>
        <p className="text-white">
          Experience the power of automation and security with QP2P. Sign up
          today and take the first step towards a smarter, faster, and more
          secure trading experience.
        </p>
        <button>
          <Link to={"/sign-up"}>Get Started Now</Link>
        </button>
      </CallToAction>
    </AboutContainer>
  );
};

export default AboutPage;
