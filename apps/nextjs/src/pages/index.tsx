import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { Button, Text, Modal, Table } from "@nextui-org/react";
import LoadingProgress from "../components/Loading";
import Error from "../components/Error";
import type { NextRouter } from "next/router";
import { useRouter } from "next/router";
import type { getSpookTypeResult } from "../types";

const Home: NextPage = () => {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const spooks = trpc.speak.getSpooks.useQuery();

  const [visible, setVisible] = React.useState(false);
  const handler = () => setVisible(true);

  const closeHandler = () => {
    setVisible(false);
    setError("");
  };

  return (
    <>
      <Head>
        <title> Speak </title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen w-screen flex-col items-center">
        {spooks.isLoading ? (
          <LoadingProgress />
        ) : spooks.error ? (
          <Error error={spooks.error.message} />
        ) : spooks.data && spooks.data.data ? (
          <SpookTable spooks={spooks.data.data} router={router} />
        ) : (
          <Text>Nothing to see here</Text>
        )}
        <Modal
          closeButton
          aria-labelledby="modal-title"
          open={visible}
          onClose={closeHandler}
        >
          <Modal.Header>
            <Text id="modal-title" size={18}>
              {error !== "" ? "An error occured" : "Success!"}
            </Text>
          </Modal.Header>
          <Modal.Body>
            {error !== "" ? <Text>{error}</Text> : <Text>Document saved!</Text>}
          </Modal.Body>
          <Modal.Footer>
            <Button auto flat color="error" onPress={closeHandler}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </main>
    </>
  );
};

const SpookTable: React.FC<{
  spooks: getSpookTypeResult;
  router: NextRouter;
}> = ({ spooks, router }) => {
  if (!spooks) return <Error error="No spooks found" />;
  return (
    <>
      <h1 style={{ marginBottom: "1em" }}>Your spooks</h1>
      <Table
        aria-label="Example table with static content"
        selectionMode="single"
        onSelectionChange={(row: any) => {
          if (row?.currentKey) {
            router.push(`/spooks/${row?.currentKey}`);
          }
        }}
        css={{
          height: "auto",
          minWidth: "90vw",
          border: "none",
        }}
      >
        <Table.Header>
          <Table.Column>Id</Table.Column>
          <Table.Column>Title</Table.Column>
        </Table.Header>
        <Table.Body>
          {spooks.map((spook) => (
            <Table.Row key={spook.id}>
              <Table.Cell>{spook.id}</Table.Cell>
              <Table.Cell>{spook.title}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};

export default Home;
