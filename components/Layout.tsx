import Head from "next/head";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react/display-name */
export default (props: any) => {
  return (
    <Container>
      <Head>

      </Head>
      {props.children}
      <h1>I&apos;m footer</h1>
    </Container>
  );
};
