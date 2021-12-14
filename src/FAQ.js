import React from "react";
import "./App.css";
import "./FAQ.css";
import Form from "./Form.js";
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  alert: {
    minHeight: 50,
  },
  root: {
    flexgrow: 1,
    minHeight: 285,
    maxHeight: 600,
  },
});
function FAQ() {
  const classes = useStyles();

  return (
    <>
      <div class="FAQ-wrap">
        <Grid container spacing={8} justifyContent="space-evenly">
          <Grid item xs={8}>
            <Card elevation={5}>
              <CardContent>
                
            <Typography gutterBottom = "true" variant="h4" style={{ fontWeight: 600 }}>Frequently Asked Questions</Typography>
            <Typography gutterBottom = "true">
              <Typography gutterBottom = "true" variant="h5" align="left"style={{ textDecoration: 'underline'}}>
                Premium Offering
              </Typography>
              <Typography gutterBottom = "true" variant="h6" align="left" style={{ fontWeight: 600 }}>
                What is NiftyPrice Premium?
              </Typography>
              <Typography gutterBottom = "true" variant="body1" align="left">
                NiftyPrice Premium is an NFT portfolio tracker that allows you
                to track, manage, and analyze the profit/loss of all your NFTs
                in real-time. Premium connects directly to your MetaMask and
                automatically syncs with the NFTs in your wallet. In Premium,
                you can view gains/losses for each of your NFT and your
                portfolio overall. View charts of your portfolio’s performance
                as well as your individual investments.
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                Is there a feature list or product demo that I can see before
                buying?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                Sure is - you can see that <a href="/demo">here</a>
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                How much does Premium cost?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                We currently charge 0.05 ETH per year for Premium access. We
                think of this as 0.0042 ETH or $17 per month.
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                Are there different pricing tiers?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                No - one flat rate for all of our product features.
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                Are you planning on adding new features and will those cost
                more?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                Yes - we’re planning on adding a ton more features. No - they
                will not cost more. The 0.05 ETH price gets you access to all
                future product features and launches.
              </Typography>

              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                How do I register/sign up?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                You can sign up on the Premium Access page <a href="/wallet">here</a>. To start,
                click the “Connect to Wallet” button. You’ll then see a
                “Register to Premium” button appear. Click that to bring up
                MetaMask. Follow the instructions in your MetaMask wallet to
                finalize the transaction and payment. Once the transaction is
                confirmed on the Ethereum network, the page should reload
                showing your portfolio and our lovely data analytics. If it does
                not appear once confirmed, try simply refreshing the
                Wallet/Premium page.
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                How does payment work?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                We charge you 0.05 ETH at time of registration. You can complete
                this transaction via MetaMask. Once your payment is confirmed on
                the network, you will automatically get access to your custom
                portfolio page, which will remain open for an entire year. After
                a year, we’ll ask for another payment of 0.05 ETH at the year
                anniversary of your registration. You’ll be able to complete
                that transaction via MetaMask just like your initial payment.
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                How do I renew my membership?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                At the year anniversary of your registration or previous
                renewal, we will ask for another 0.05 ETH payment. At that time,
                we’ll provide you with another registration button to finalize
                the payment via MetaMask - similar to your registration process.
                The process is quick and all of your data and settings will
                remain intact.
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                How do you value my NFTs in the Premium offering?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                Currently, we use two methods to value each of your NFTs:
                collection floor price and trait floor price. Collection floor
                price uses the live floor price of the overall collection in
                which your NFT belongs and applies that value to your NFT. Trait
                floor looks at all the traits of your NFT, calculates the floor
                price for each of those traits, and applies the highest floor
                price from that list as the value of your NFT. Currently, we use
                trait floor as the default valuation method.
              </Typography>
              <Typography gutterBottom = "true" variant="h5" align="left" style={{ textDecoration: 'underline'}}>
                Website
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                Can you add X, Y, Z collection to your site?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                Of course - please feel out the <a href="/purchase">feedback form</a>. Please be sure
                to include the name of the collection and the collection’s
                OpenSea URL. We normally get new collection requests loaded on
                the site the same day.
              </Typography>
              <Typography gutterBottom = "true" variant="h6" style={{ fontWeight: 600 }} align="left">
                Can you provide data further back than August 2021?
              </Typography>
              <Typography gutterBottom = "true" variant="subtitle1" align="left">
                Unfortunately, with the way OpenSea and other exchanges are
                currently set up, there are no historical market data/metrics
                available to the public. As a result, the historical data
                presented on our site is a product of us collecting and storing
                this data ourselves. Since we’re a fairly new site, most of this
                did not take place until August/October for many of the major
                NFT collections on our site, which is why we don’t have any
                historical data prior to that. That said, we continue to scour
                the web for solutions to augment our existing dataset with
                metrics that go back much further in time.
              </Typography>

              <Typography gutterBottom = "true" variant="h6" align="center">
                If you have other questions, please reach out either by filling
                out the form on the <a href="/demo">feedback page</a> or shooting us a note
                directly at team@niftyprice.io
              </Typography>
            </Typography>
              </CardContent>
              </Card>

          </Grid>
        </Grid>
      </div>
    </>
  );
}
export default FAQ;
