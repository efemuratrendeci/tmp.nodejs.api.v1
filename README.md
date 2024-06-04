# Node JS Template Repo

This repo includes express with dynamic rooting mechanism. You can just create a controller add it to ApplicationBuilder and you are good to go!.
Applicaiton will create routes it self by getting route names from your methods. Let me explain :

```js
class TrafficController extends BaseController {
  constructor(res) {
    super(res);
    this.initMetaData();
  }

  getSign_$signId = () => return this.ok({ content: { sign: 'stop' } })
}
```

This code block will generate route *GET traffic/sign/:signId* just that simple.
