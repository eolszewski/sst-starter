import { Bucket, StackContext, Table } from "@serverless-stack/resources";

export function Database({ stack }: StackContext) {
  
  const bucket = new Bucket(stack, "Uploads");

  const table = new Table(stack, "table", {
    fields: {
      pk: "string",
      sk: "string",
      gsi1pk: "string",
      gsi1sk: "string",
    },
    primaryIndex: {
      partitionKey: "pk",
      sortKey: "sk",
    },
    globalIndexes: {
      gsi1: {
        partitionKey: "gsi1pk",
        sortKey: "gsi1sk",
      },
    },
  });

  const notes = new Table(stack, "Notes", {
    fields: {
      userId: "string",
      noteId: "string",
    },
    primaryIndex: { 
      partitionKey: "userId", 
      sortKey: "noteId" 
    },
  });

  return {
    bucket,
    table,
    notes,
  };
}
