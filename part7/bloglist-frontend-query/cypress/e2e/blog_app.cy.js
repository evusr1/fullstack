describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    cy.createUser({
      name: "Test Testerson",
      username: "ttesterson",
      password: "password",
    });
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("login to application");
    cy.contains("username");
    cy.contains("password");

    cy.get("#username");
    cy.get("#password");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("ttesterson");
      cy.get("#password").type("password");

      cy.get("#login-button").click();
      cy.contains("Logged in as Test Testerson");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("ttesterson");
      cy.get("#password").type("wrong");

      cy.get("#login-button").click();
      cy.get(".error").should("contain", "invalid username and password");
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
      cy.get(".error").should("have.css", "border-style", "solid");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "ttesterson", password: "password" });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#author").type("Product Productson");
      cy.get("#title").type("Title of Blog");
      cy.get("#url").type("http://test.com");

      cy.get("#create-button").click();

      cy.get(".error").should(
        "contain",
        "a new blog Title of Blog by Product Productson"
      );

      cy.contains("Title of Blog Product Productson");
    });

    describe("and one blog exist", () => {
      beforeEach(function () {
        cy.createBlog({
          author: "Product Productson",
          title: "Title of Blog",
          url: "http://test.com",
        });
      });
      it("A blog can be liked", function () {
        cy.contains("show").click();
        cy.contains("like").click();
        cy.contains("1");
        cy.contains("like").click();
        cy.contains("2");
      });
      it("A blog can be deleted by user", function () {
        cy.contains("show").click();
        cy.contains("remove").click();

        cy.contains("Title of Blog Product Productson").should("not.exist");
      });
    });

    describe("and several blog posts", function () {
      beforeEach(function () {
        cy.createBlog({
          author: "Product Productson",
          title: "Title of Blog",
          url: "http://test.com",
        });

        cy.createUser({
          name: "Matt Windsor",
          username: "mwindsor",
          password: "password",
        });

        cy.login({ username: "mwindsor", password: "password" });

        cy.createBlog({
          author: "Baron",
          title: "The Cyber",
          url: "http://cyber.com",
        });

        cy.createBlog({
          author: "European Guy",
          title: "FulStackOpen",
          url: "https://fullstackopen.com/",
        });
      });

      it("remove button displays only to creator", function () {
        cy.contains("Title of Blog Product Productson")
          .parent()
          .as("notMineBlog");
        cy.get("@notMineBlog").contains("show").click();
        cy.get("@notMineBlog")
          .contains("remove")
          .should("have.css", "display", "none");

        cy.contains("The Cyber Baron").parent().as("MineBlog");
        cy.get("@MineBlog").contains("show").click();
        cy.get("@MineBlog")
          .contains("remove")
          .should("have.css", "display", "inline-block");
        cy.get("@MineBlog").contains("remove").click();

        cy.contains("The Cyber Baron").should("not.exist");
      });

      it("test likes order", function () {
        cy.contains("FulStackOpen European Guy").parent().as("BlogWith2");
        cy.get("@BlogWith2").contains("show").click();
        cy.get("@BlogWith2").contains("like").click();
        cy.get("@BlogWith2").contains("1");
        cy.get("@BlogWith2").contains("like").click();
        cy.get("@BlogWith2").contains("2");

        cy.contains("Title of Blog Product Productson")
          .parent()
          .as("BlogWith1");
        cy.get("@BlogWith1").contains("show").click();
        cy.get("@BlogWith1").contains("like").click();
        cy.get("@BlogWith1").contains("1");

        cy.get(".blog").eq(0).should("contain", "FulStackOpen European Guy");
        cy.get(".blog")
          .eq(1)
          .should("contain", "Title of Blog Product Productson");
        cy.get(".blog").eq(2).should("contain", "The Cyber");
      });
    });
  });
});
